import {Chat as ChatAPI} from "@/services/chatBot.api";
import {useState} from "react";
import userIcon from "@/assets/images/userIcon.jpeg"
import {Textarea} from "@/components/ui/textarea";
import {Send} from "lucide-react";
import botIcon from "@/assets/images/tobib.png";

export default function Chat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Bonjour ! Comment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    if (!input.trim()) return; // Évite les messages vides

    // Ajoute le message de l'utilisateur à la liste des messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: input },
    ]);

    // Envoie le message au backend et récupère la réponse
    const response = await ChatAPI(input, localStorage.getItem("token"));
    console.log("Réponse du backend : ", response); // Affiche la réponse réelle



    // Ajoute la réponse du bot à la liste des messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: response },
    ]);

    setInput(""); // Vide le champ d'entrée
  };

  return (
    <div className="flex flex-col align-center w-full h-full ">

      <div className="flex-1 overflow-y-auto w-3/5 min-w-96 m-auto p-4 space-y-3 ">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start ${
              message.sender === "user" ? "justify-end" : ""
            }`}
          >
            {message.sender === "bot" && (
              <img src={botIcon} alt="Bot" className="w-16 h-16 rounded-full mr-3" />
            )}
            <div
              className={`${
                message.sender === "bot" ? "bg-transparent rounded-tl-none border " : "bg-primary text-white rounded-tr-none "
              } p-2 rounded-2xl  shadow-md max-w-xs`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs text-muted-foreground mt-2 block">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            {message.sender === "user" && (
              <img src={userIcon} alt="User" className="w-8 h-8 rounded-full  ml-3" />
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="flex items-center w-2/3 h-20 mb-8 min-w-96 mx-auto mt-4 p-6 space-x-4"
      >
        <Textarea
          className="flex-1 resize-none focus:ring-2 focus:ring-blue-500 border-primary"
          placeholder="Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type={"submit"}
          className={"w-8 h-8 cursor-pointer transition-colors hover:text-primary"}
        >
          <Send />
        </button>
      </form>
    </div>
  );
}