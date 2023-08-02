<p align="center">
  <h3 align="center">Snapify</h3>

  <p align="center">
    The self-hostable Loom alternative.
    <br />
    <a href="https://snapify.it"><strong>Learn more »</strong></a>
  </p>

<p align="center">
  <a href='https://status.snapify.it'><img src='https://betteruptime.com/status-badges/v1/monitor/jgon.svg'  alt='Uptime'/></a>
  <a href='https://github.com/MarconLP/snapify/stargazers'><img src='https://img.shields.io/github/stars/MarconLP/snapify'  alt='Github Stars'/></a>
  <!--<a href="https://news.ycombinator.com/item?id=34279062"><img src="https://img.shields.io/badge/Hacker%20News-352-%23FF6600" alt="Hacker News"></a>-->
  <a href="https://github.com/MarconLP/snapify/pulse"><img src="https://img.shields.io/github/commit-activity/m/MarconLP/snapify" alt="Commits-per-month"></a>
  <a href="https://snapify.it"><img src="https://img.shields.io/badge/Pricing-Free-brightgreen" alt="Pricing"></a>
  <a href="https://twitter.com/Marcon565"><img src="https://img.shields.io/twitter/follow/Marcon565?style=flat" alt='twitter'></a>
</p>

<p align="center">
  <a href="https://snapify.it">Website</a> - <a href="https://github.com/MarconLP/snapify/issues">Issue</a> - <a href="https://github.com/MarconLP/snapify/issues/new">Bug report</a>
</p>

## Snapify allows you to record and share recordings asynchronously

- Make unlimited recordings of your tab, desktop, and any application
- Share recordings with anyone using a public link
- Delete or un-list recordings after a specific timeframe
- Upload and share existing videos

## Development

### Setup

1. Clone the repo into a public GitHub repository (or fork https://github.com/MarconLP/snapify/fork). If you plan to distribute the code, make sure to comply with our `LICENSE.md`.

   ```sh
   git clone https://github.com/MarconLP/snapify.git
   ```

2. Go to the project folder

   ```sh
   cd snapify
   ```

3. Install packages with npm

   ```sh
   npm i
   ```

4. Set up your .env file
    - Duplicate `.env.example` to `.env`
    - Use `openssl rand -base64 32` to generate a key and add it under `NEXTAUTH_SECRET` in the .env file.
    - <details>
      <summary>Fill in the other variables</summary>
         <details>
         <summary>Configure DATABASE_URL</summary>
   
         1. Open [Railway](https://railway.app/) and click "Start a New Project", and select Provision "MySQL".
         2. Select the MySQL App and copy the `DATABASE_URL` into the `.env`.

         </details>
         <details>
         <summary>Obtaining the Github API Credentials</summary>

         1. Open [Github Developer Settings](https://github.com/settings/apps).
         2. Next, go to [OAuth Apps](https://github.com/settings/developers) from the side pane. Then click the "New OAuth App" button. Make sure to set `Authorization callback URL` to `<Snapify URL>/api/auth/callback/github` replacing Snapify URL with the URI at which your application runs.
         3. Copy the `Client ID` as `GITHUB_ID` into the `.env`.
         4. Next, click "Generate a new client secret" and copy the `Client secret` as `GITHUB_SECRET` into the `.env`.

         </details>
         <details>
         <summary>Obtaining the AWS S3 API Credentials</summary>

         1. Open [B2 Cloud Storage Buckets](https://secure.backblaze.com/b2_buckets.htm).
         2. Create a new Bucket, make sure to set the bucket to private to make sure files are not being made publicly available.
         3. Copy the `Endpoint` as `AWS_ENDPOINT` and the Bucket name as `AWS_BUCKET_NAME` into the `.env`. Additionally you need to add the `AWS_REGION`, which is part of the endpoint and should look like this: `us-east-005`.
         4. Next, go to [Application Keys](https://secure.backblaze.com/app_keys.htm) from the side pane. Then create a new Application Key, with full read and write access to the bucket.
         5. Copy the `keyID` as `AWS_KEY_ID` and the `applicationKey` as `AWS_SECRET_ACCESS_KEY` into the `.env`.

         </details>
      </details>
   
5. Set up the database using the Prisma schema

   ```sh
   npx prisma db push
   ```
   
6. Run (in development mode)

   ```sh
   npm run dev
   ```

### E2E-Testing

Be sure to set the environment variable `NEXTAUTH_URL` to the correct value. If you are running locally, as the documentation within `.env.example` mentions, the value should be `http://localhost:3000`.

```sh
# In a terminal just run:
npm run test:e2e
```

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMarconLP%2Fsnapify&env=DATABASE_URL,NEXTAUTH_URL,NEXTAUTH_SECRET,GITHUB_ID,GITHUB_SECRET,AWS_ENDPOINT,AWS_REGION,AWS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_BUCKET_NAME&project-name=snapify&repository-name=snapify)

## Contributing
Please see our contributing guide at `CONTRIBUTING.md`

## License
Distributed under the AGPLv3 License. See `LICENSE.md` for more information.
