import express from 'express';
import { join } from 'path';
import fs from 'fs';
import getRepositories from '../build/retrieve';
import processPRs from '../build/process';
import notifyHipchat from '../build/notify';

const app = express();

app.get('/github/repos', (req, res) => {
  getRepositories(req.query)
    .tap(repos => fs.writeFileSync(join(__dirname, 'full_response.json'), JSON.stringify(repos, null, 2)))
    .then(repos => res.json({ repos }))
    .catch(err => res.status(500).json({ error: err.toString() }))
})

app.get('/github/prs', (req, res) => {
  processPRs({ repo: req.query.repo })
    .then(pr => res.json({ pr }))
    .catch(err => res.status(500).json({ error: err.toString() }))
})

app.post('/hipchat/notify', (req, res) => {
  notifyHipchat(req.body)
    .catch(err => res.status(500).json({ error: err.toString() }))
})

app.listen(12121, () => console.log('listening', 12121));