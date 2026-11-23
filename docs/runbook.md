# Runbook

## Checks
Call `GET /api/ping`. The service is up when it answers `200` with `{"pong":true}`.

To confirm: is this endpoint also the check to use behind a load balancer or monitor?
