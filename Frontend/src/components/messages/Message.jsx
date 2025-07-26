import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";

	const shakeClass = message.shouldShake ? "shake" : "";

	// Fix: Ensure message.message is a string
	let messageContent = "";
	if (typeof message.message === "string") {
		messageContent = message.message;
	} else {
		// Convert object to JSON string or provide a fallback
		console.warn("Expected string, received:", message.message);
		messageContent = JSON.stringify(message.message);
	}

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Profile' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble break-words text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
				{messageContent}
			</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
		</div>
	);
};

export default Message;
