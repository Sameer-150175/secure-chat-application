# Testing Guide

## Server

~~~bash
cd server
npm install
npm test
~~~

## Client

~~~bash
cd client
npm install
npm run build
~~~

Recommended manual checks:

- Register a demo admin user.
- Create a domain record.
- Confirm analytics update.
- Verify protected endpoints reject missing tokens.
