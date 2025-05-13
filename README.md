# Piano Music Database _(PMD)_ - Back End CMS
**Piano Music Database - Find the perfect piece.**

_CMS/API: [Strapi](https://strapi.io), [PostgreSQL](https://postgresql.org), [TypeScript](https://typescriptlang.org), [Typesense](https://typesense.org), [Brevo](https://brevo.com), [GitHub](https://github.com)_

[![Deploy Prod](https://github.com/pianomusicdb/pmdCMS/actions/workflows/deploy-prod.yml/badge.svg?branch=prod&event=push)](https://github.com/pianomusicdb/pmdCMS/actions/workflows/deploy-prod.yml)

---

## Repository Description
This repository holds the files for the Back End CMS of Piano Music Database.  
The back end CMS is powered by [Strapi](https://strapi.io) with [TypeScript](https://typescriptlang.org) powered by a [PostgreSQL](https://postgresql.org) database. The files are managed and deployed from a [GitHub](https://github.com). The search engine is powered by [Typesense](https://typesense.org).

## Technology Description
- Robust database/API using [Strapi](https://strapi.io) with [TypeScript](https://typescriptlang.org) powered by a [PostgreSQL](https://postgresql.org) database
- Powerful search engine using [Typesense](https://typesense.org)
- Emails using [Brevo](https://brevo.com)
- Continuous integration and continuous delivery/deployment using [GitHub](https://github.com)

---

## Relevant Links
- Frontend: [PianoMusicDatabase.com](https://PianoMusicDatabase.com)
- Backend: [api.pianomusicdatabase.com/admin](https://api.pianomusicdatabase.com/admin)

---

## Copyright Information
**Copyright 2021-2025 Piano Music Database TM**

**Some rights reserved.**

Use of [Piano Music Database’s code](https://github.com/pianomusicdb/pmdCMS "pmdCMS GitHub Repository") is strictly forbidden.

**Font Used:**
- [Montserrat](https://github.com/JulietaUla/Montserrat) by [Julieta Ulanovsky](https://github.com/JulietaUla) (Copyright 2010-2021 Julieta Ulanovsky) (SIL Open Font License 1.1)

---

## Local Development

### Setup Instructions

1. Clone repository to local folder

2. Install all dependencies in that folder  
    `npm install`

3. Build to test for errors ***(build often!)***  
    `npm run build --clean`  
    *`.env` file should be created to show more data when running locally.*

4. Run the local development server  
    `npm run develop`  
    *`.env` file should be created to show more data when running locally.*

5. Open [http://localhost:1337](http://localhost:1337) in your browser to see the result.

6. Stop the server  
    `CTRL+C`  
    `Y`

### Check Stripe Webhooks Locally *(Windows 64bit)*

1. Download "Stripe-CLI" `stripe_x.xx.x_windows_x86_64.zip` from [github.com/stripe/stripe-cli/releases](https://github.com/stripe/stripe-cli/releases)

2. Unzip stripe.exe from the downloaded zip file

3. Type "cmd" into the address bar of file explorer while in the folder you put the exe in

4. Log into the Stripe webhook service `stripe login`

5. Start the webhook listening `stripe listen --forward-to 127.0.0.1:1337/api/stripe/webhook`

6. Test something that triggers a webhook like Stripe subscriptions and look for the logs in the terminal window

---

## Production Deployment

1. Setup remote server with SSH Key for root access

2. Configure DNS to point to new server  
    1. "A" record, `api.pianomusicdatabase.com` host, `xxx.xxx.xxx.xxx` ipv4

3. Log into Server IP using the root user via SSH

4. Update System  
    `sudo apt update`  
    `sudo apt upgrade -y`

5. Create New User  
    ```sudo adduser {{NONROOT_SUDO_USER``` *(Enter a secure password)*  
    ```sudo usermod -aG sudo {{NONROOT_SUDO_USER}}```

6. Log into `{{NONROOT_SUDO_USER}}`

7. Install PostgreSQL 14.15  
    `sudo apt install postgresql postgresql-contrib -y`

8. Configure PostgreSQL  
    `sudo -i -u postgres`  
    `psql`

9. Create database and DB user  
    ```CREATE DATABASE {{DB_NAME}};```  
    ```CREATE USER {{DB_USER}} WITH ENCRYPTED PASSWORD {{DB_NAME_PASSWORD}};```  
    ```ALTER USER {{DB_USER}} WITH SUPERUSER;```  
    ```GRANT ALL PRIVILEGES ON DATABASE {{DB_NAME}} TO {{DB_USER}};```  
    `\\q`

10. Log back into `{{NONROOT_SUDO_USER}}`

11. Dump Old PostgreSQL Database using Dump  
    `pg_dump -h {{OLD_POSTGRESQL_DB_HOST}} -U {{OLD_POSTGRESQL_DB_USER}} -d {{OLD_POSTGRESQL_DB_NAME}} -F c -f prod_db_backup.dump`

12. Restore PostgreSQL Database from Dump  
    `pg_restore -h localhost -U {{NEW_POSTGRESQL_DB_USER}} -d {{NEW_POSTGRESQL_DB_NAME}} --no-owner --no-acl -F c prod_db_backup.dump`

13. Install NVM  
    `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`

14. Reload shell configuration  
    `source ~/.bashrc`

15. Install Node.js  
    `nvm install 18`  
    `nvm use 18 `  
    `nvm alias default 18`

16. Install Nginx  
    `sudo apt install nginx -y`

17. Configure Nginx for pmdCMS  
    `sudo nano /etc/nginx/sites-available/pmdCMS-prod`  
    ```
    server {
        server_name api.pianomusicdatabase.com;

        location / {
            proxy_pass http://localhost:1337;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```  
    `CTRL + x` and `y` and `ENTER` to exit nano

18. Enable site in Nginx  
    `sudo ln -s /etc/nginx/sites-available/pmdCMS-prod /etc/nginx/sites-enabled/`    
    `sudo nginx -t`  
    `sudo systemctl restart nginx`  
    `sudo systemctl enable nginx`

19. Install PM2  
    `npm install -g pm2`

20. Install Certbot for SSL  
    `sudo apt install certbot python3-certbot-nginx -y`

21. Apply Certbot SSL to URLs and Setup auto-renew  
    `sudo certbot --nginx `
    ```
    echo "0 0,12 \* \* \* root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() \* 3600)' && sudo certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
    ```

22. Clone prod branch of the [pmdCMS repository](https://github.com/pianomusicdb/pmdCMS) into ```/home/{{NONROOT_SUDO_USER}}/```  
    ```
    git clone --single-branch --branch prod https://pianomusicdb:ACCESSKEYHERE@github.com/pianomusicdb/pmdCMS.git pmdCMS-prod
    ```  

23. Enter git cloned folder  
    `cd pmdCMS-prod`

24. Adjust env vars for production use

25. Install npm dependencies  
    `npm install`

26. Run a Build (Production) 
    `NODE_ENV=production npm run build`

27. Start pmdCMS in pm2  
    `pm2 start npm --name "pmdCMS-prod" -- run start`

28. Setup PM2 Startup Script and Save  
    `pm2 startup`  
    `pm2 save`

29. Check the backend is running by going to [https://api.pianomusicdatabase.com/admin](https://api.pianomusicdatabase.com/admin)

---

## Strapi Links

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://docs.strapi.io) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.
- [Strapi GitHub repository](https://github.com/strapi/strapi) - Give feedback and contributions to the official GitHub repo.
- [Deployment section of the documentation](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/deployment.html) - Get production/remote deployment details and tips.
