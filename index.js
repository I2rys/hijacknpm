(async()=>{
    "use strict";

    // Dependencies
    const { ArgumentParser } = require("argparse")
    const { runJobs } = require("parallel-park")
    const request = require("request-async")
    const Whoiser = require("whoiser")
    const shelljs = require("shelljs")
    const fs = require("fs")
    
    // Variables
    const parser = new ArgumentParser()
    
    var hijacked = false
    var args;

    // Functions
    function checkPackages(packages){
        return new Promise(async(resolve)=>{
            await runJobs(
                packages,
                async(pkg, index, max)=>{
                    var response = await request(`https://registry.npmjs.org/${pkg}`)
                    response = JSON.parse(response.body)

                    if(response.hasOwnProperty("maintainers")) for( const maintainer of response.maintainers){
                        const email = maintainer.email

                        try{
                            var domainExists = await Whoiser(email.replace(/.*@/, ""))
                            domainExists = JSON.stringify(domainExists)

                            if(domainExists.indexOf("DOMAIN NOT FOUND") !== -1){
                                console.log(`${pkg} can be hijacked. Name: ${maintainer.name} | Email: ${email}`)
                                hijacked = true
                            }
                        }catch{
                            console.log(`Unable to check ${pkg}. Name: ${maintainer.name} | Email: ${email}`)
                        }
                    }
                }
            )
            
            if(!hijacked) console.log("No packages found that can be hijacked.")

            resolve()
        })
    }
    
    // Main
    parser.add_argument("-pkg", "--package", { help: "Check if the specified package can be hijack." })
    parser.add_argument("-pkgs", "--packages", { help: "Path of a file that contains NPM packages name to check." })
    parser.add_argument("-s", "--self", { help: "Check if any of the installed NPM packages can be hijack.", nargs: "?", const: 1 })
    
    args = parser.parse_args()
    
    if(args.package){
        console.log("Checking if the package can be hijack, please wait.")

        var response = await request(`https://registry.npmjs.org/${args.package}`)
        response = JSON.parse(response.body)

        if(response.hasOwnProperty("maintainers")){
            for( const maintainer of response.maintainers){
                const email = maintainer.email
    
                try{
                    var domainExists = await Whoiser(email.replace(/.*@/, ""))
                    domainExists = JSON.stringify(domainExists)
    
                    if(domainExists.indexOf("DOMAIN NOT FOUND") !== -1){
                        console.log(`${args.package} can be hijacked. Name: ${maintainer.name} | Email: ${email}`)
                        hijacked = true
                    }
                }catch{
                    console.log(`Unable to check ${args.package}. Name: ${maintainer.name} | Email: ${email}`)
                }
            }
            
            if(!hijacked) console.log("The package can't be hijack.")
        }else{
            console.log("The package does not have any maintainers.")
        }

        return
    }else if(args.packages){
        const packages = fs.readFileSync(args.packages, "utf8").replace(/\r/g, "").split("\n")

        if(!packages.length) return console.log("The file is empty.")

        await checkPackages(packages)

        console.log("Finished.")
    }else if(args.self){
        console.log("Grabbing installed NPM packages, please wait.")
        var packages = shelljs.exec("npm list", { silent: true }).stdout.match(/\w+.*@/g)
        packages = packages.map((pkg) => pkg.replace("@", ""))
    
        console.log("Checking NPM packages, please wait.")
        
        await checkPackages(packages)

        console.log("Finished.")
    }else{
        console.log("Please use at least 1 argument.")
    }
})()