# Images migration (pre 2.0)

This script must run only once, when v2.0 will be deployed.

## how to

- make sure to create a backup of the virtuoso database first! That way, if the script fails, you
  can rollback
- make the script executable: chmod a+x scripts/migrate-images/run.sh
- run : mu script project-scripts migrate-images
