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
- Upload and share existing to videos

## Development

### Setup

1. Clone the repo into a public GitHub repository (or fork https://github.com/MarconLP/snapify/fork). If you plan to distribute the code, make sure to comply with our `LICENSE.md`.

   ```sh
   git clone https://github.com/MarconLP/snapify.git
   ```

1. Go to the project folder

   ```sh
   cd snapify
   ```

1. Install packages with yarn

   ```sh
   npm i
   ```

1. Set up your .env file
    - Duplicate `.env.example` to `.env`
    - Use `openssl rand -base64 32` to generate a key and add it under `NEXTAUTH_SECRET` in the .env file.
    - Fill in the other variables


1. Run (in development mode)

   ```sh
   npm run dev
   ```

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMarconLP%2Fsnapify)

## Contributing
Please see our contributing guide at `CONTRIBUTION.md`

## License
Distributed under the Sustainable Use License. See `LICENSE.md` for more information.