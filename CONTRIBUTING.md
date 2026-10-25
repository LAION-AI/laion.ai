# Contributing

Contributions to the LAION website are welcome. Please open a pull request and have it reviewed by at least one other person. Changes to critical organizational content, including `src/content/pages/team.json`, require review by the LAION team.

Before opening a pull request, run:

```sh
bun run check
bun run lint
bun run test
```

Keep existing public routes stable. If a route must move, add an explicit redirect and extend the parity manifest.
