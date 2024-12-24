import express from "express";
import { FactoryInstance } from "../index"
import responseHeader from "./Header/header";
import AppRouter from "./router";

const port = 8080;

async function Applition() {
    const middlewares = [
        express.json(),
        responseHeader,
    ]
    const app = await FactoryInstance.create(AppRouter,middlewares, (server) => {
        // callback
    })
    app.listen(port, () => {
        console.log(`http://127.0.0.1:${port}`);
    })
}

Applition()