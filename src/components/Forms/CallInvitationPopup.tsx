// import React from 'react';
// import { useCallContext } from '../context/CallContext';

// const CallInvitationPopup: React.FC = () => {
//   const { incomingCall, acceptCall, rejectCall } = useCallContext();

//   if (!incomingCall) return null;

//   return (
//     <div className="fixed top-4 right-4 bg-white p-6 rounded-lg shadow-lg z-50">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">
//         Incoming Call from {incomingCall.fromUsername}
//       </h2>
//       <div className="flex space-x-4">
//         <button
//           onClick={acceptCall}
//           className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition"
//         >
//           Accept
//         </button>
//         <button
//           onClick={rejectCall}
//           className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
//         >
//           Reject
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CallInvitationPopup;














// import React from 'react';
// import { useCallContext } from '../context/CallContext';

// const CallInvitationPopup: React.FC = () => {
//   const { incomingCall, acceptCall, rejectCall } = useCallContext();

//   if (!incomingCall) return null;

//   return (
//     <div className="fixed top-4 right-4 bg-white p-6 rounded-lg shadow-lg z-50 animate-in fade-in-50">
//       <h2 className="text-xl font-bold mb-4 text-gray-800">
//         Incoming Call from {incomingCall.fromUsername}
//       </h2>
//       <div className="flex space-x-4">
//         <button
//           onClick={acceptCall}
//           className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition"
//           aria-label="Accept call"
//         >
//           Accept
//         </button>
//         <button
//           onClick={rejectCall}
//           className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
//           aria-label="Reject call"
//         >
//           Reject
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CallInvitationPopup;













import React from 'react';
import { useCallContext } from '../context/CallContext';

const CallInvitationPopup: React.FC = () => {
  const { incomingCall, acceptCall, rejectCall } = useCallContext();

  if (!incomingCall) return null;

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 animate-in fade-in-50">
      <h2 className="text-lg font-semibold text-center mb-4 text-gray-800">
        Incoming Call from {incomingCall.fromUsername}
      </h2>
      <div className="flex space-x-4 justify-center">
        <button
          onClick={acceptCall}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition"
          aria-label="Accept call"
        >
          Accept
        </button>
        <button
          onClick={rejectCall}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
          aria-label="Reject call"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default CallInvitationPopup;