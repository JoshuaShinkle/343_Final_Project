import React from "react";
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import deployOutput from "./deployOutputs.json";
import { Button } from "@nextui-org/react";

const Main = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState("");
    const [filterStock, setFilterStock] = useState("");

    const onInputChange = async (e) => {
        const { name, value } = e.target;
        setFilterStock(value);
    };

    const handleStockClick = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(
                "https://hudbih8bf4.execute-api.us-east-2.amazonaws.com/prod/portfolio/TSLA",
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            console.log("data is: ", JSON.stringify(data, null, 4));

            setData(data);
            console.log(data);
            console.log(data.records);
        } catch (err) {
            setErr(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSummaryClick = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(
                "https://hudbih8bf4.execute-api.us-east-2.amazonaws.com/prod/portfolio",
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            console.log("data is: ", JSON.stringify(data, null, 4));

            setData(data);
            console.log(data);
            console.log(data.records);
        } catch (err) {
            setErr(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostData = async (symbol, quantity, lot_cost) => {
        setIsLoading(true);
        try {
            axios
                .post(
                    "https://hudbih8bf4.execute-api.us-east-2.amazonaws.com/prod/portfolio",
                    {
                        symbol: "CAR",
                        purchase_time: "10:05 AM",
                        quantity: 10,
                        lot_cost: 123.6,
                    }
                )
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (err) {
            setErr(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {err && <h2>{err}</h2>}

            <button onClick={handleSummaryClick}>Fetch summary data</button>
            <button onClick={handleStockClick}>Fetch TSLA data</button>
            <button onClick={handlePostData}>Buy Stock</button>

            {isLoading && <h2>Loading...</h2>}
            <h1>Stocks:</h1>
            {data.map((stock) => {
                return (
                    <div key={`${stock.symbol}${stock.purchase_time}`}>
                        <table>
                            <tr>
                                <th>SYMBOL: </th>
                                <th>TOTAL COINS: </th>
                                <th>TOTAL COST: </th>
                                <th>AVG SHARE: </th>
                                <th>DETAILS: </th>
                            </tr>
                            <tr>
                                <td>{stock.symbol}</td>
                                <td>{stock.shares}</td>
                                <td>{stock.total}</td>
                                <td>{stock.avg}</td>
                            </tr>
                        </table>
                        <br />
                    </div>
                );
            })}

            <br />
            <h1>Summary:</h1>

            {data
                .filter((stock) => stock.symbol === "TSLA")
                .map((stock) => {
                    return (
                        <div key={`${stock.symbol}${stock.purchase_time}`}>
                            <table>
                                <tr>
                                    <th>SYMBOL: </th>
                                    <th>PURCHASE TIME: </th>
                                    <th>QUANTITY: </th>
                                    <th>LOT COST: </th>
                                    <th>AVG SHARE: </th>
                                </tr>
                                <tr>
                                    <td>{stock.symbol}</td>
                                    <td>{stock.purchase_time}</td>
                                    <td>{stock.quantity}</td>
                                    <td>{stock.lot_cost}</td>
                                    <td>{`$${(
                                        stock.lot_cost / stock.quantity
                                    ).toFixed(2)}`}</td>
                                </tr>
                            </table>
                            <br />
                        </div>
                    );
                })}
        </div>
    );
};

export default Main;

//PROPS:
//: api_url
