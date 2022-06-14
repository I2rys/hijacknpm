# HijackNPM
Powerful CLI that can be used to hijack NPM packages.

## Installation
Github:
```
git clone https://github.com/I2rys/hijacknpm
```

NpmJS:
```
npm i argparse parallel-park request-async whoiser shelljs fs
```

## Usage
```
usage: HiJackNPM [-h] [-pkg PACKAGE] [-pkgs PACKAGES] [-s [SELF]]

optional arguments:
  -h, --help            show this help message and exit
  -pkg PACKAGE, --package PACKAGE
                        Check if the specified package can be hijack.
  -pkgs PACKAGES, --packages PACKAGES
                        Path of a file that contains NPM packages name to check.
  -s [SELF], --self [SELF]
                        Check if any of the installed NPM packages can be hijack.
```

## License
MIT © I2rys