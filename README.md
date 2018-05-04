# Milestone: SPECIAL

## Team Members

   1. Rushi Bhatt - rbhatt
   2. Rutvij Mehta - rmehta4
   3. Vignesh Nandakumar - vnandak
   4. Zankruti Desai - zndesai
     
## New Relic Digital Intelligence Platform 

New Relic's digital intelligence platform that lets developers, ops, and tech teams measure and monitor the performance of their applications and infrastructure.It provides various kind of services for Real-Time Analytics, Full-Stack visibility and Scalable Cloud platform.<br>
We used following services provied by New relic:       
1) New Relic APM: Build, deploy, and maintain great applications with detailed performance metrics for every aspect of your environment.
2) New Relic Infrastructure: Correlate health metrics with recent config changes so you can troubleshoot quickly, scale rapidly, and deploy intelligently.
3) New Relic Insights: Gain real-time visibility and insights into the health of your software and operations with self service dashboards.

## Screencast:

https://youtu.be/sz4JQQ3r_AI

## APM Implementation
Phase 1 of the special milestone involved creating an APM dashboard that would monitor the activity parameters for checkbox.io Parameters that we have primarily focused on are:
 1.	Throughput
 2.	Memory
 3.	Response time
 4.	CPU Usage
 5.	Error Rate

Following are the steps that were followed.      
1. New Relic provides with the unique license key which we map for the application. Grab the unique key.
2. Install New Relic node.js agent -> npm install newrelic --save
3. Next configure the newrelic.js file
   a. Copy newrelic.js from node_modules/newrelic into the ../server-side/site
   b. Set a value for app_name - "checkbox".
   c. Replace the license_key value with New Relic license key from Step 1.
4. Include the newrelic module in server.js - require('newrelic')
5. Deploy the application
6. Check the new relic dashboard for the data : https://rpm.newrelic.com/accounts/1811096/applications/87651227
      
### APM Dashboards
1) __Web Transactions Time:__ <br>
![web-transaction time dashboard](https://media.github.ncsu.edu/user/8428/files/7d04fff4-d881-11e7-9c57-ccfbaf0dcf90)

2) __Throughput:__ <br>
![Throughput](https://media.github.ncsu.edu/user/8428/files/742dfba6-d881-11e7-94b7-161af3c48ece)

3) __Transactions:__ <br>
![Transactions](https://media.github.ncsu.edu/user/8428/files/6b65b4f0-d881-11e7-9e21-1f846ffbbeb9)

4) __Hosts:__ <br>
![Host](https://media.github.ncsu.edu/user/8428/files/5b136016-d881-11e7-8d44-536efdb5b2d1)

## Infrastructure Implementation

Phase 2 of the special milestone involved creating an infrastrcture dashboard that would monitor the server performance for
all the servers for iTrust and checkbox application. Parameters that we have primarily focused on are:
 1.	Network
 2.	Storage
 3.	Events
 4.	Process

We have created ansible role called 'new Relic' which we have added in every deployment part of ansible scripts.After the new
Relic in successfully installed , data will be sent to new Relic dashboard via agent.

### Infrastructure Dashboards
![Data](https://media.github.ncsu.edu/user/5949/files/fecf0654-d883-11e7-8ba6-ed90d09d16f0)

![img2](https://media.github.ncsu.edu/user/5949/files/088cfa88-d885-11e7-942a-e8ba87ecbef5)

## Insights Implementation

Phase 3 of the special milestone involved creating a custom dashboard that would show the dashboard from the execued query. 

![img3](https://media.github.ncsu.edu/user/5949/files/dae28a5c-d885-11e7-9590-9ff3142a546d)

