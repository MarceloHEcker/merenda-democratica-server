import * as tf from '@tensorflow/tfjs-node'

class TensorService {

/**
	 * Pegando os dados brutos e realizando uma limpeza
 	*/
     async getData(productsData) {
 
		const cleaned = productsData.map(product => ({
			valor_unitario: parseFloat(product.valor_unitario),
			quantidade: parseFloat(product.quantidade),
		}))
		.filter(product => (product.valor_unitario != null && product.quantidade != null));
	
		//filtrando registros com outliers no valor unitário
		const filteredXValues = this.filterOutliers(cleaned.map(item => item.valor_unitario));
		const filteredXData = cleaned.filter(item => filteredXValues.includes(item.valor_unitario));
	
		//filtrando registros com outliers na quantidade
		const filteredValues = this.filterOutliers(filteredXData.map(item => item.quantidade));
		const filteredData = filteredXData.filter(item => filteredValues.includes(item.quantidade));
	
		return filteredData;
	}

	/**
	 * Método que filtra outliers de elementos presentes em um array
	 *  
	 */
	filterOutliers(someArray) {

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

	createModel() {
		// Create a sequential model
		const model = tf.sequential(); 
		
		// Add a single input layer
		model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
		
		// Add an output layer
		model.add(tf.layers.dense({units: 1, useBias: true}));
	  
		return model;
	}

	/**
	 * Método resposnável por criar o modelo para realizar 
	 */
	createModel() {

	//criando um modelo utilizando a API sequencial (1 entrada - 1 saída)
	const model = tf.sequential();
  
	//definindo uma camada de entrada dos dados
	model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
  
	//defindo camadas intermeditárias ocultas que utilizam a função de ativação sigmóide 
	model.add(tf.layers.dense({ units: 50, activation: 'sigmoid' }));
  
	//definindo uma camada de saída dos dados
	model.add(tf.layers.dense({ units: 1, useBias: true }));
  
	return model;
  }

  	/*
	* Converte os dados de entrada para tensores que possamos realizar aprendizado  
	*  de forma mais ediciente
	*/
	convertToTensor(data) {

		return tf.tidy(() => {
		
			//randomizando a ordem dos dados
			tf.util.shuffle(data);
		
			//convertendo os dados para tensores. 1 rensor de entrada e outro tensor com as saídas
			const inputs = data.map(d => d.quantidade)
			const labels = data.map(d => d.valor_unitario);
		
			const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
			const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
		
			// normalizando os dados na escala 0-1 utilizando as funções utilitárias min e max do TensorFlow
			const inputMax = inputTensor.max();
			const inputMin = inputTensor.min();
			const labelMax = labelTensor.max();
			const labelMin = labelTensor.min();
		
			// funções auxiliares do tensor flow evitam que seja necessário laços para determinar
			// valores mínimos e máximos 
			const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
			const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));
		
			// retornando os tensores e as informações para poder recuperar essas valores novamente
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

  async trainModel(model, inputs, labels) {

	//preparando o modelo para treinamento
	model.compile({
	  //escolhendo o otimizador
	  optimizer: tf.train.adam(),
	  //definindo a medida de erro
	  loss: tf.losses.meanSquaredError,
	  metrics: ['mse'],
	});
  
	//definindo o tamanho dos blocos de dados utilizados no treinamento
	const batchSize = 32;
	//definindo o numero de interações inteiras realizadas no dataset
	const epochs = 50;
  
	//iniciando o treinamento e exibindo valores do índice de erro em um gráfico
	return await model.fit(inputs, labels, {
	  batchSize,
	  epochs,
	  shuffle: true,
	  callbacks: []
	});
  }

  testModel(model, inputData, normalizationData, product, uf) {
		const { inputMax, inputMin, labelMin, labelMax } = normalizationData;
	
		const [xs, preds] = tf.tidy(() => {
	
		// gerando previsões para uma faixa uniforme de valores entre 0 e 1
		const xs = tf.linspace(0, 1, 100);
		const preds = model.predict(xs.reshape([100, 1]));
	
		//desnormalizando dos dados
		const unNormXs = xs
			.mul(inputMax.sub(inputMin))
			.add(inputMin);
	
		const unNormPreds = preds
			.mul(labelMax.sub(labelMin))
			.add(labelMin);
	
		return [unNormXs.dataSync(), unNormPreds.dataSync()];
		});

		//dados previstos
		const predictedPoints = Array.from(xs).map((val, i) => {
			return { x: val, y: preds[i], produto: product, uf: uf }
		});

		return predictedPoints;
	}


}

export default new TensorService();
