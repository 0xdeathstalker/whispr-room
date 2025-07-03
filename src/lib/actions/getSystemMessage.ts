export default function getSystemMessage({ username, messageContent }: { username: string; messageContent: string }) {
  const messageArray = messageContent.split(" ");
  const isCurrentUser = messageArray[0] === username;

  if (isCurrentUser) messageArray[0] = "you";
  const finalMessage = messageArray.join(" ");

  return finalMessage;
}
