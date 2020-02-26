// 除錯： chrome://inspect/#workers

const pn = [2]; // 存放質數的陣列
let runningTime;

const getPrimeNumbers = (num=2e7)=>{
	const startTime = new Date().getTime();
	let i, m, n, isPrime;

	for(n=3; n<=num; n++){
		isPrime = true; // 假設 n 為質數
		m = Math.floor(Math.sqrt(n)); // n 的平方根
		for(i=0; i<pn.length; i++){
			if(pn[i] > m) break; // 判斷到 n 的平方根 m
			if(n%pn[i]===0){
				isPrime = false;
				break;
			}
		}
		if(isPrime){
			pn.push(n);
		}
	}
	runningTime = new Date().getTime() - startTime;
};

getPrimeNumbers();

self.onconnect = event=>{
	const port = event.ports[0]; // MessagePort
	port.onmessage = event=>{
		port.postMessage({
			primeNumbers: pn,
			runningTime: runningTime,
			action: event.data,
		});
	};
	console.log('event.ports:', event.ports);
};
