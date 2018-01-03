import React from 'react';

export default ({ token, amount, single, total }) => (
    <tr>
        <td>{token}</td>
        <td>{amount}</td>
        <td>$ {single} USD</td>
        <td>$ {total} USD</td>
    </tr>
);