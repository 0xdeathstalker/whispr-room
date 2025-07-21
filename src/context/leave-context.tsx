import * as React from "react";

type LeaveRoomContext = {
  isLeaving: React.RefObject<boolean>;
};

const LeaveRoomContext = React.createContext<LeaveRoomContext | undefined>(undefined);

export function LeaveRoomContextProvider({ children }: { children: React.ReactNode }) {
  const isLeaving = React.useRef(false);

  return <LeaveRoomContext.Provider value={{ isLeaving }}>{children}</LeaveRoomContext.Provider>;
}

export function useLeaveRoom() {
  const context = React.useContext(LeaveRoomContext);

  if (!context) {
    throw new Error("useLeaveRoom hook must be used within a LeaveRoomContextProvider");
  }

  return context;
}
