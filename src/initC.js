export default (channel) => {
	const hook = new Map()

	channel.onmessage = ({ data }) => hook.get(data[0])(...data[1])

	return [
		(key, func) => {
			hook.set(key, func)
			return () => {
				hook.delete(key)
			}
		},
		(kind, ...msg) => channel.postMessage([kind, msg]),
	]
}
