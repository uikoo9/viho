// util
import { callLLM } from './agent-util.js';
/**
 * runAgents
 * @param {*} agents
 */
export const runAgents = async (agents) => {
  // for
  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];

    // const
    const agentStartCallback = agent.agentStartCallback;
    const agentRequestOptions = agent.agentRequestOptions;
    const agentEndCallback = agent.agentEndCallback;

    // go
    agentStartCallback();
    const agentResponse = await callLLM(agentRequestOptions);
    agentEndCallback(agentResponse);
  }
};
