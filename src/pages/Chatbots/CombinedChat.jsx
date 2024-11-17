import Chat from './Chat'
import ChatReport from './ChatReport'

export default function CombinedChat() {
return(
  <div>
    <Chat/>
    <ChatReport/>
  </div>
)  
}
// const [isChatOpen, setIsChatOpen] = useState(false)
// const [showBubble, setShowBubble] = useState(true)

// const handleChatToggle = (isOpen) => {
//   setIsChatOpen(isOpen)
// }

// useEffect(() => {
//   const timer = setInterval(() => {
//     setShowBubble((prev) => !prev)
//   }, 3000)

//   return () => clearInterval(timer)
// }, [])

// return (
//   <div className="relative">
//     <div className="fixed bottom-2 right-2 z-50">
//       <div className="relative w-16 h-16">
//         <Chat onToggle={handleChatToggle} />
//         <svg 
//           className={`absolute top-0 left-0 w-full h-full animate-spin-slow transition-opacity duration-300 ${
//             isChatOpen ? 'opacity-0' : 'opacity-100'
//           }`} 
//           viewBox="0 0 100 100"
//         >
//           <path
//             id="circlePath"
//             d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
//             fill="none"
//           />
//           <text className="text-[10px]">
//             <textPath href="#circlePath" startOffset="0%">
//               Chat with Agastya  
//             </textPath>
//           </text>
//         </svg>
//       </div>
//     </div>
//     <div className="fixed bottom-20 right-1 z-50">
//       <div className="relative">
//         <ChatReport />
//         <div 
//           className={`absolute -top-[89px] -left-24 bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-opacity duration-300 ${
//             showBubble ? 'opacity-100' : 'opacity-0'
//           }`}
//         >
//           Click me!
//           <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-green-700 border-r-8 border-r-transparent"></div>
//         </div>
//       </div>
//     </div>
//     <style jsx>{`
//       @keyframes spin-slow {
//         from {
//           transform: rotate(0deg);
//         }
//         to {
//           transform: rotate(360deg);
//         }
//       }
//       .animate-spin-slow {
//         animation: spin-slow 20s linear infinite;
//       }
//       text {
//         fill: black;
//       }
//     `}</style>
//   </div>