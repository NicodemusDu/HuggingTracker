import { Storage } from "@plasmohq/storage";

const storage = new Storage();

storage.watch({
	spaceData: (newValue) => {
		console.log("spaceData 已更新:", newValue);
		// 发送通知
		chrome.notifications.create({
			type: "basic",
			iconUrl: "icon.png",
			title: "数据更新",
			message: "spaceData 已经更新",
		});
	},
});

// 可以添加更多的监听器
chrome.action.onClicked.addListener((tab) => {
	console.log("Extension icon clicked");
	// 打开弹出窗口或执行其他操作
	chrome.action.openPopup();
});
