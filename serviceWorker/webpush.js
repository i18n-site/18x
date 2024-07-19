F.push = (e) => {
	e.waitUntil(self.registration.showNotification(...e.data.json()))
}

F.notificationclick = (e) => {
	e.notification.close()
	e.waitUntil(clients.openWindow(e.notification.data.url))
}
