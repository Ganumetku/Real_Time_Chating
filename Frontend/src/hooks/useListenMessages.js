import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { setMessages } = useConversation();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			newMessage.shouldShake = true;

			const sound = new Audio(notificationSound);
			sound.play();

			setMessages((prevMessages) => [...prevMessages, newMessage]); // ✅ Appends new message
		});

		return () => socket?.off("newMessage");
	}, [socket]);

};

export default useListenMessages;
