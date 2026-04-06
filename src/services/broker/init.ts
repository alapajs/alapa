import { BrokerAdapter } from "../../interface";
import { GlobalConfig } from "../../shared/globals";
import { Logger } from "../../utils";

export let broker: BrokerAdapter;
export const InitializeBrokers = async () => {
  const config = GlobalConfig.broker;
  if (config?.enabled === true) {
    Logger.info("Initializing Broker");
    const adapter = GlobalConfig.broker?.adapter;
    broker = new adapter!();
    await broker.connect();
  }
};
