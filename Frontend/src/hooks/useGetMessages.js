import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { GET_MESSAGE } from "../Url";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(`${GET_MESSAGE}/${selectedConversation._id}`, {
					credentials: "include",
				});
				const data = await res.json();
				if (data.error) throw new Error(data.error);

				// ✅ Only set messages if no messages are already loaded
				if (messages.length === 0) {
					setMessages(data);
				}
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) {
			getMessages();
		}
	}, [selectedConversation?._id]); // ✅ removed setMessages from deps

	return { messages, loading };
};

export default useGetMessages;
