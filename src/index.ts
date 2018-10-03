import * as applescript from 'applescript'
import { parse } from 'url'
import * as fs from 'fs'

const osa = (script): Promise<string> =>
    new Promise((resolve, reject) => {
        applescript.execString(script, (err, rtn) => {
            if (err) {
                reject(err)
            } else {
                resolve(rtn)
            }
        })
    })

process.on('uncaughtException', function(err) {
    osa(`tell app "System Events" to display dialog "Error ${err}"`)
})

process.on('unhandledRejection', error => {
    osa(`tell app "System Events" to display dialog "Error ${error}"`)
})

async function dev() {}

async function main() {
    if (
        (await osa(`tell application "System Events" to return name of first process where it is frontmost`)) ===
        'Google Chrome'
    ) {
        const url = parse(await osa('tell application "Google Chrome" to return URL of active tab of front window'))
        if (url.host === 'github.com' && url.path && url.path && url.path.split('/').length >= 2) {
            const ownerAndRepo = url.path
                .split('/')
                .slice(0, 3)
                .join('/')
            const fsPath = process.env.HOME + '/git/github.com' + ownerAndRepo
            const file =
                url.path.split('/').slice(5).length > 0
                    ? url.path
                          .split('/')
                          .slice(5)
                          .join('/')
                    : undefined
            await osa(`
tell application "iTerm"
  tell current window
    create tab with default profile
    tell current session
      write text "mkdir -p ${fsPath} ; cd ${fsPath} ; git clone https://github.com/${ownerAndRepo} . ; code .${
                file ? ' ; code ' + file : ''
            }"
    end tell
  end tell
end tell
            `)
        }
    } else {
        await osa(`tell app "System Events" to display dialog "Not on a GitHub page"`)
    }
}

if (process.argv[2] === 'dev') {
    fs.writeFileSync('/Users/chrismwendt/foo.txt', 'hi')
    dev()
} else {
    fs.writeFileSync('/Users/chrismwendt/foo.txt', 'there')
    main()
}
