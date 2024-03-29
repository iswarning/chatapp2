import { mutate } from 'swr'

let latestData = null

// setup ws and broadcast to all SWRs
const GRAPHQL_ENDPOINT_WS = 'ws://localhost:5000/graphql';

const headers = {'Content-Type': 'application/json'};

const subscribe = async(...args: any[]) => {
	if(typeof window !== 'undefined') {
		const ws = new WebSocket(GRAPHQL_ENDPOINT_WS, "graphql-ws");
		console.log(ws)
		const init_msg = {
		  type: 'connection_init',
		  payload: { headers: headers }
		};
		ws.onopen = function(event) {
		  ws.send(JSON.stringify(init_msg));
		  const msg = {"id":"1","type":"start","payload":{"variables":{},"extensions":{},"operationName":null,"query": args[0]}};
		  ws.send(JSON.stringify(msg));
		};
		ws.onmessage = function(data) {
		  const finalData = JSON.parse(data.data);
		  if(finalData.type === 'data') {
			latestData = finalData.payload.data
			mutate('subscription', latestData, false)
			return latestData;
		  }
		};
	}
};

export default subscribe;