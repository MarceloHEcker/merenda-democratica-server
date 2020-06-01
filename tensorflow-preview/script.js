/**
 * Get the car data reduced to just the variables we are interested
 * and cleaned of missing data.
 */
async function getData() {
  const productsDataReq = await fetch('http://localhost/tensorflow-preview/produtos/polpa_frutas.json');
  const productsData = await productsDataReq.json();
  const cleaned = productsData.map(product => ({
    valor_unitario: parseFloat(product.valor_unitario),
    quantidade: parseFloat(product.quantidade),
  }))
    .filter(product => (product.valor_unitario != null && product.quantidade != null));

  const filteredXValues = filterOutliers(cleaned.map(item => item.valor_unitario));
  const filteredXData = cleaned.filter(item => filteredXValues.includes(item.valor_unitario));

  const filteredValues = filterOutliers(filteredXData.map(item => item.quantidade));
  const filteredData = filteredXData.filter(item => filteredValues.includes(item.quantidade));

  return filteredData;
}



function filterOutliers(someArray) {

  // Copy the values, rather than operating on references to existing values
  var values = someArray.concat();

  // Then sort
  values.sort(function (a, b) {
    return a - b;
  });

  /* Then find a generous IQR. This is generous because if (values.length / 4) 
   * is not an int, then really you should average the two elements on either 
   * side to find q1.
   */
  var q1 = values[Math.floor((values.length / 4))];
  // Likewise for q3. 
  var q3 = values[Math.ceil((values.length * (3 / 4)))];
  var iqr = q3 - q1;

  // Then find min and max values
  var maxValue = q3 + iqr * 1.5;
  var minValue = q1 - iqr * 1.5;

  // Then filter anything beyond or beneath these values.
  var filteredValues = values.filter(function (x) {
    return (x <= maxValue) && (x >= minValue);
  });

  // Then return
  return filteredValues;
}


function createModel() {
  // Create a sequential model
  const model = tf.sequential();

  // Add a single input layer
  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));

  model.add(tf.layers.dense({ units: 50, activation: 'sigmoid' }));

  // Add an output layer
  model.add(tf.layers.dense({ units: 1, useBias: true }));

  return model;
}

/**
* Convert the input data to tensors that we can use for machine 
* learning. We will also do the important best practices of _shuffling_
* the data and _normalizing_ the data
* valor_unitario on the y-axis.
*/
function convertToTensor(data) {
  // Wrapping these calculations in a tidy will dispose any 
  // intermediate tensors.

  return tf.tidy(() => {
    // Step 1. Shuffle the data    
    tf.util.shuffle(data);

    // Step 2. Convert data to Tensor
    const inputs = data.map(d => d.quantidade)
    const labels = data.map(d => d.valor_unitario);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    }
  });
}

async function trainModel(model, inputs, labels) {
  // Prepare the model for training.  
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });

  const batchSize = 32;
  const epochs = 50;

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'mse'],
      { height: 200, callbacks: ['onEpochEnd'] }
    )
  });
}


function testModel(model, inputData, normalizationData) {
  const { inputMax, inputMin, labelMin, labelMax } = normalizationData;

  // Generate predictions for a uniform range of numbers between 0 and 1;
  // We un-normalize the data by doing the inverse of the min-max scaling 
  // that we did earlier.
  const [xs, preds] = tf.tidy(() => {

    const xs = tf.linspace(0, 1, 100);
    const preds = model.predict(xs.reshape([100, 1]));

    const unNormXs = xs
      .mul(inputMax.sub(inputMin))
      .add(inputMin);

    const unNormPreds = preds
      .mul(labelMax.sub(labelMin))
      .add(labelMin);

    // Un-normalize the data
    return [unNormXs.dataSync(), unNormPreds.dataSync()];
  });


  const predictedPoints = Array.from(xs).map((val, i) => {
    return { x: val, y: preds[i], produto: 'Polpa de frutas, diversos sabores, congelada', uf: 'AC' }
  });

  console.log('predictedPoints', predictedPoints);

  const originalPoints = inputData.map(d => ({
    x: d.quantidade, y: d.valor_unitario,
  }));


  tfvis.render.scatterplot(
    { name: 'Model Predictions vs Original Data' },
    { values: [originalPoints, predictedPoints], series: ['original', 'predicted'] },
    {
      xLabel: 'Quantidade',
      yLabel: 'Valor Unitário',
      height: 300
    }
  );
}


async function run() {
  // Load and plot the original input data that we are going to train on.
  const data = await getData();
  const values = data.map(d => ({
    x: d.quantidade,
    y: d.valor_unitario,
  }));

  console.log("values", values);

  tfvis.render.scatterplot(
    { name: 'Quantidade x Valor Unitário' },
    { values },
    {
      xLabel: 'Quantidade',
      yLabel: 'Valor Unitário',
      height: 300
    }
  );

  // More code will be added below


  // Create the model
  const model = createModel();
  tfvis.show.modelSummary({ name: 'Model Summary' }, model);

  // Convert the data to a form we can use for training.
  const tensorData = convertToTensor(data);
  const { inputs, labels } = tensorData;

  // Train the model  
  await trainModel(model, inputs, labels);
  console.log('Done Training');

  testModel(model, data, tensorData);
}

document.addEventListener('DOMContentLoaded', run);
