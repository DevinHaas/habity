# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease

# Accept NEXT_PUBLIC_* build args that need to be available at build time
ARG NEXT_PUBLIC_APP_URL

COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release

# Accept build args
ARG DATABASE_URL
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG NEXT_PUBLIC_APP_URL

# Convert build args to environment variables for runtime
ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/.next .next
COPY --from=prerelease /usr/src/app/public public
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/next.config.ts .
COPY --from=prerelease /usr/src/app/db db
COPY --from=prerelease /usr/src/app/drizzle.config.ts .

# Create .next/cache directory and set correct permissions
RUN mkdir -p .next/cache/images && chown -R bun:bun /usr/src/app

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
