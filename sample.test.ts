import { describe, expect, test } from "@jest/globals";

(async () => {
  //simulate orderbook entry, so currently orderbook has 3 ordergroups
  const orderBook = {
    orderId: BigInt("404202202"),
    volume: Number(8),
    type: "ASK",
    price: Number(10.26),
    status: "unfilled",
  };

  test("Submit bid order of 5, to match with 8 ask orders.", () => {
    /*
  our goal is to match a bid order with 5 volume,
  TEST DATA PREPARATION : we created a sell order in orderbook
  Then below is the order we plan to use as our main Test "bidRequest"
  */
    const bidRequest = {
      volume: 5,
      type: "BID",
      price: 10.32,
    };

    //This Log wil show the current order in orderbook
    console.log(orderBook);
    const establishVolume = orderBook.volume;

    /*We start the test by calling the api, sending our testdata. 
    Approach differs depending on the structure of API or the testframework itself
    so assuming we already sent the request, and we're expecting that once a trade has
    a match we will expect :
    orderId of the match ask trade
    if there is a remaining volume in ask, then value is updated
    if trade has equal volume, status should be filled.
  */
    const response = matchAvailableAskOrder(bidRequest);
    console.log("MATCHED ORDERID:", response);

    //This log is jus part of evidence to show what happened after the trade.
    console.log(orderBook);

    //validations for Bid Response
    expect(response).toBeTruthy(); //check if response is not undefined
    expect(response.toString()).toBe("404202202"); //check if orderId match as expected

    //validations for Ask Response
    //if there is remaining 3 volume, we should expect that orderbook still contains volume of 3.
    expect(orderBook.volume).toEqual(
      Number(establishVolume) - Number(bidRequest["volume"])
    );

    //since the ask order was not completely filled, we expect it to still be unfilled
    expect(orderBook.status).toBe("unfilled");
  });

  //I just create a mock function to do the trade, no complex logic.
  function matchAvailableAskOrder(bidRequest: any): string {
    if (orderBook.volume - bidRequest["volume"] == 0) {
      orderBook.status = "filled";
    } else {
      orderBook.volume = Number(orderBook.volume - bidRequest["volume"]);
    }
    return orderBook.orderId.toString();
  }
})();
