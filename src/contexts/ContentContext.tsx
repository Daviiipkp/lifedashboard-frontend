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

interface ContentData {
  streaks: StreaksData | any;
  pertinentData: PertinentData | any;
  habitsCfg: HabitsConfig | any;
  dailyData: DailyData | any;
  refreshConfig: () => void;

  waitForStreaks: () => Promise<AxiosResponse<StreaksData, any, {}>>;
  waitForLog: () => Promise<AxiosResponse<DailyLog, any, {}>>;
}

const ContentContext = createContext<ContentData | undefined>(undefined);

export const ContentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  let streaks = api.get<StreaksData>("/api/streaksdata");
  let pertinentData = api.get<PertinentData>("/api/pertinentData");
  let habitsCfg = api.get<HabitsConfig>("/api/habitscfg");
  let dailyData = api.get<DailyData>("/api/dailydata");
  const refreshConfig = () => {
    streaks = api.get<StreaksData>("/api/streaksdata");
    pertinentData = api.get<PertinentData>("/api/pertinentdata");
    habitsCfg = api.get<HabitsConfig>("/api/habitscfg");
    dailyData = api.get<DailyData>("/api/dailydata");
  };
  async function waitForStreaks() {
    return await api.get<StreaksData>("/api/streaksdata");
  }
  async function waitForLog() {
    return await api.get<StreaksData>("/api/getlog");
  }
  return (
    <ContentContext.Provider
      value={{
        streaks,
        pertinentData,
        habitsCfg,
        dailyData,
        refreshConfig,
        waitForStreaks,
        waitForLog,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
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
