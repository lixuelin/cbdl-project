import Balance from "./balance_api";
import User from "./user_api";
import Income from "./income_api";
import Invest from "./invest_api";
import Bonus from "./bonus_api";
import Financial from "./financial_api";
import Manager from "./manager_api";
import Cash from "./cash_api";
import Multiple from "./multiple_api";
import Agent from "./Agent_api";

const api = Object.assign(
    {},
    Balance,
    User,
    Income,
    Invest,
    Bonus,
    Financial,
    Manager,
    Cash,
    Multiple,
    Agent
);

export default api;
