import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { GET_MESSAGE } from "../Url";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(`${GET_MESSAGE}/${selectedConversation._id}`, {
					credentials: "include",
				});
				const data = await res.json();
				if (data.error) throw new Error(data.error);

				setMessages(data); // ✅ Always set full conversation messages
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) {
			getMessages();
		}
	}, [selectedConversation?._id]); // ✅ no unnecessary deps

	return { loading };
};

export default useGetMessages;
