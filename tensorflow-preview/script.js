/**
 * Pegando os dados brutos e realizando uma limpeza
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

  var values = someArray.concat();

  values.sort(function (a, b) {
    return a - b;
  });

  var q1 = values[Math.floor((values.length / 4))];

  var q3 = values[Math.ceil((values.length * (3 / 4)))];
  var iqr = q3 - q1;

  var maxValue = q3 + iqr * 1.5;
  var minValue = q1 - iqr * 1.5;

  var filteredValues = values.filter(function (x) {
    return (x <= maxValue) && (x >= minValue);
  });

  return filteredValues;
}


function createModel() {
  const model = tf.sequential();

  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));

  model.add(tf.layers.dense({ units: 50, activation: 'sigmoid' }));

  model.add(tf.layers.dense({ units: 1, useBias: true }));

  return model;
}

function convertToTensor(data) {

  return tf.tidy(() => {
    tf.util.shuffle(data);

    const inputs = data.map(d => d.quantidade)
    const labels = data.map(d => d.valor_unitario);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    }
  });
}

async function trainModel(model, inputs, labels) {
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

  const [xs, preds] = tf.tidy(() => {

    const xs = tf.linspace(0, 1, 100);
    const preds = model.predict(xs.reshape([100, 1]));

    const unNormXs = xs
      .mul(inputMax.sub(inputMin))
      .add(inputMin);

    const unNormPreds = preds
      .mul(labelMax.sub(labelMin))
      .add(labelMin);

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


  const model = createModel();
  tfvis.show.modelSummary({ name: 'Model Summary' }, model);

  const tensorData = convertToTensor(data);
  const { inputs, labels } = tensorData;

  await trainModel(model, inputs, labels);
  console.log('Done Training');

  testModel(model, data, tensorData);
}

document.addEventListener('DOMContentLoaded', run);
