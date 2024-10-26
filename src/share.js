import initC from "x/initC.js"

const W = "/W.js"

export const [hook, send] = initC(
	globalThis.SharedWorker ? new SharedWorker(W).port : new Worker(W),
)

// TODO : check worker port is available
// https://stackoverflow.com/questions/13662089/javascript-how-to-know-if-a-connection-with-a-shared-worker-is-still-alive/71499332#71499332
//
// class Port {
// 	constructor(port, onMessage, onDisconnect, onError) {
// 		this.onDisconnect = onDisconnect;
// 		this.disconnected = false;
// 		this.weakRef = new WeakRef(port);
// 		port.onmessage = (e) => onMessage(e.data);
// 		if (onError) {
// 			port.onmessageerror = (e) => onError(e);
// 		}
// 		if ("start" in port) {
// 			port.start();
// 		}
// 	}
// 	isAlive() {
// 		if (this.disconnected) {
// 			// May occur, if the port was given away while alive, but response to it came after it "died"
// 			return false;
// 		} else if (!this.weakRef.deref()) {
// 			// If port is no longer accessible, call destructor
// 			this.onDisconnect();
// 			this.disconnected = true;
// 			return false;
// 		}
// 		return true;
// 	}
// 	postMessage(message, options) {
// 		try {
// 			const port = this.weakRef.deref();
// 			if (!port) {
// 				throw new TypeError(`Port is no longer reference-able`);
// 			}
// 			// In some browsers, if the other side of the port is no longer available, it will throw an error
// 			port.postMessage(message, options);
// 		} catch (_a) {
// 			this.onDisconnect();
// 			this.disconnected = true;
// 		}
// 	}
// 	close() {
// 		var _a;
// 		this.onDisconnect();
// 		this.disconnected = true;
// 		(_a = this.weakRef.deref()) === null || _a === void 0 ? void 0 : _a.close();
// 	}
// }
//
// export class PortAwareSharedWorker {
// 	constructor(port, messageHandle, disconnectHandle) {
// 		this.messageHandle = messageHandle;
// 		this.disconnectHandle = disconnectHandle;
// 		this.portsSet = new Set();
// 		this.initializePort(port);
// 		// Poll based check to delete
// 		setInterval(() => {
// 			for (const port of this.portsSet) {
// 				port.isAlive();
// 			}
// 		}, 100);
// 	}
// 	initializePort(port) {
// 		const portWrapper = new Port(
// 			port,
// 			(data) => this.messageHandle(portWrapper, data, this.getOpenPorts()),
// 			() => this.disconnectHandle(portWrapper, this.getOpenPorts()),
// 		);
// 		this.portsSet.add(portWrapper);
// 	}
// 	/**
// 	 * Gets all currently opened ports. May also return some ports that are no longer active,
// 	 * but over time all inactive ports will be gone.
// 	 *
// 	 * @see(https://html.spec.whatwg.org/multipage/web-messaging.html#ports-and-garbage-collection)
// 	 */
// 	getOpenPorts() {
// 		const remainingPorts = [];
// 		for (const port of this.portsSet) {
// 			if (port.isAlive()) {
// 				remainingPorts.push(port);
// 			} else {
// 				this.portsSet.delete(port);
// 			}
// 		}
// 		return remainingPorts;
// 	}
// 	static initializeProxy(
// 		/** Pass `self` to this. The `self` can be from a `Worker` or `ServiceWorker` for convince */
// 		global,
// 		messageHandle,
// 		disconnectHandle,
// 	) {
// 		return new Promise((resolve) => {
// 			if (PortAwareSharedWorker.instance) {
// 				return resolve(PortAwareSharedWorker.instance);
// 			}
// 			global.onconnect = function sharedConnectCallback(e) {
// 				if (PortAwareSharedWorker.instance) {
// 					PortAwareSharedWorker.instance.initializePort(e.ports[0]);
// 					return;
// 				}
// 				resolve(
// 					(PortAwareSharedWorker.instance = new PortAwareSharedWorker(
// 						e.ports[0],
// 						messageHandle,
// 						disconnectHandle,
// 					)),
// 				);
// 			};
// 			// This is the fallback, just in case the browser doesn't support SharedWorkers
// 			if (!("SharedWorkerGlobalScope" in global)) {
// 				resolve(
// 					(PortAwareSharedWorker.instance = new PortAwareSharedWorker(
// 						global,
// 						messageHandle,
// 						disconnectHandle,
// 					)),
// 				);
// 			}
// 		});
// 	}
// }
