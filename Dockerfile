# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN --mount=type=cache,target=/root/.bun/install/cache \
    cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN --mount=type=cache,target=/root/.bun/install/cache \
    cd /temp/prod && bun install --frozen-lockfile --production

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

COPY --chown=bun:bun --from=install /temp/prod/node_modules node_modules
COPY --chown=bun:bun --from=prerelease /usr/src/app/.next .next
COPY --chown=bun:bun --from=prerelease /usr/src/app/public public
COPY --chown=bun:bun --from=prerelease /usr/src/app/package.json .
COPY --chown=bun:bun --from=prerelease /usr/src/app/next.config.ts .
COPY --chown=bun:bun --from=prerelease /usr/src/app/db db
COPY --chown=bun:bun --from=prerelease /usr/src/app/drizzle.config.ts .

# Create .next/cache directory
RUN mkdir -p .next/cache/images

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
