function dev() {
    console.log('dev')
}

function main() {
    console.log('main')
}

if (process.argv[2] === 'dev') {
    dev()
} else {
    main()
}
