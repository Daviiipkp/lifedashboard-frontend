import { createContext, useContext } from "react";
import type {
  DailyData,
  DailyLog,
  HabitsConfig,
  PertinentData,
  StreaksData,
} from "../types/general";
import { api } from "../services/api";
import type { AxiosResponse } from "axios";
import { useAuth } from "./AuthContext";

interface ContentData {
  waitForStreaks?: () => Promise<AxiosResponse<StreaksData, any, {}>>;
  waitForLog?: () => Promise<AxiosResponse<DailyLog, any, {}>>;
  waitForDailyData?: () => Promise<AxiosResponse<DailyData, any, {}>>;
  waitForPertinentData?: () => Promise<AxiosResponse<PertinentData, any, {}>>;
  saveLog?: (dl: DailyLog) => Promise<AxiosResponse<StreaksData, any, {}>>;
}

const ContentContext = createContext<ContentData | undefined>(undefined);

export const ContentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { authState } = useAuth();
  if (authState.isAuthenticated) {
    async function waitForStreaks() {
      return await api.get<StreaksData>("/api/streaksdata");
    }
    async function waitForLog() {
      return await api.get<DailyLog>("/api/getlog");
    }
    async function waitForDailyData() {
      return await api.get<DailyData>("/api/dailydata");
    }
    async function waitForPertinentData() {
      return await api.get<PertinentData>("/api/pertinentdata");
    }
    async function saveLog(dl: DailyLog) {
      return await api.post<StreaksData>("/api/savelog", dl);
    }

    return (
      <ContentContext.Provider
        value={{
          waitForStreaks,
          waitForDailyData,
          waitForLog,
          waitForPertinentData,
          saveLog,
        }}
      >
        {children}
      </ContentContext.Provider>
    );
  } else {
    return (
      <ContentContext.Provider value={{}}>{children}</ContentContext.Provider>
    );
  }
};

export const useContent = () => {
  const context = useContext(ContentContext);

  if (!context) {
    throw new Error(
      "useContent should be used inside scope of ContentProvider"
    );
  }

  return context;
};
