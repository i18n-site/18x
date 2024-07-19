// shared workers for websocket

const R = (API) => {
	const BC = new BroadcastChannel(""),
		send = (kind, ...msg) => BC.postMessage([kind, msg])
	let WS, USER
	const conn = () => {
		const user = USER
		if (!user) {
			// close for no user
			if (WS != null) {
				WS.close()
			}
			return
		}

		WS = new WebSocket(
			`wss:${API}ws/` +
				user
					.slice(0, 2)
					.map((i) => i.toString(36))
					.join("/"),
		)

		Object.assign(WS, {
			binaryType: "arraybuffer",
			onmessage: ({ data }) => {
				// if data instanceof ArrayBuffer
				// data = new Uint8Array(data)
				const p = data.indexOf("["),
					n = parseInt(data.slice(0, p), 36)
				switch (n) {
					case 0: // USER VER UPDATE
						USER = [user[0], ...JSON.parse(data.slice(p) + "]")]
						send(n, USER)
				}
			},
			onclose: () => {
				if (USER) {
					setTimeout(conn, 1e3)
				}
			},
		})
	}

	onconnect = ({ ports }) => {
		ports[0].onmessage = ({ data }) => {
			;[
				(user) => {
					// user websocket init
					if (USER && user) {
						if (USER[0] === user[0]) {
							USER = user
							return
						}
						WS.close()
					}
					USER = user
					conn()
				},
			][data[0]](...data[1])
		}
	}
	// onopen:=>
	//   return
}
