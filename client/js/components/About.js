import React from 'react';

export default () => (
    <section className="section container">
        <h1 className="title">About</h1>
        This website is a private project to keep track of the different crypto currencies in my portfolio.
        You can create an array of item which need a token name, an amout and the exchange you want to use
        to get information on that token. The textarea will help you with validation issues.<br />
        Above the textarea you can find the supported exchanges and follow the links to see if your currency
        is listed there. Below the headline "Rainbow" the total sum of your portfolio will be rendered is USD.
        You can manually trigger update with the button or hit the refresh icon to have auto updates enabled.
        By default it will update every 30 seconds. You can also hit the save button to store your information
        in the url to bookmark this page for later usage. You can also manipulate the auto update interval and
        if auto update should be enabled or not. In the tab name you can see the current state of your portfolio
        while using other browser tabs.<br />
        If you can encouter any issue or have question or freature requests, feel free to mail at info@checkmy.cash
    </section>
);