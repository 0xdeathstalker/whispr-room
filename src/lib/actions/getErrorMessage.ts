export default function getErrorMessage(error: Error) {
  if (error.message.includes("Room doesn't exist or has expired")) {
    return "Room has expired or it doesn't exist!";
  } else if (error.message.includes("Participant with the same username already exists in the room!")) {
    return "Participant with the same username already exists in the room, please join with different username";
  } else {
    return error.message;
  }
}
