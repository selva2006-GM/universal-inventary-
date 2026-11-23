
#!/usr/bin/env bash

set -euo pipefail

echo "======================================"
echo "  INVENTORY V2 - SERVER SETUP"
echo "======================================"

ROOT="server"

# Create directories
mkdir -p "$ROOT"/src/{config,database/{migrations,seeds},modules/{auth,users,workspaces,products,sales,inventory,reports,audit},middleware,services,jobs,utils,tests/{unit,integration,helpers}}

# Create main files
FILES=(
  "src/app.js"
  "src/server.js"

  "src/config/env.js"
  "src/config/database.js"
  "src/config/redis.js"
  "src/config/email.js"

  "src/database/migrate.js"

  "src/middleware/authenticate.js"
  "src/middleware/authorize.js"
  "src/middleware/validate.js"
  "src/middleware/rateLimiter.js"
  "src/middleware/errorHandler.js"
  "src/middleware/notFound.js"

  "src/services/email.service.js"
  "src/services/token.service.js"
  "src/services/cloudinary.service.js"
  "src/services/sync.service.js"

  "src/jobs/email.worker.js"
  "src/jobs/sync.worker.js"
  "src/jobs/cleanup.worker.js"

  "src/utils/ApiError.js"
  "src/utils/ApiResponse.js"
  "src/utils/asyncHandler.js"
  "src/utils/logger.js"

  ".env.example"
  ".gitignore"
  "Dockerfile"
)

for file in "${FILES[@]}"; do
    if [[ ! -e "$ROOT/$file" ]]; then
        touch "$ROOT/$file"
    fi
done

# Create module files
MODULES=(
  auth
  users
  workspaces
  products
  sales
  inventory
  reports
  audit
)

for module in "${MODULES[@]}"; do

    DIR="$ROOT/src/modules/$module"

    touch "$DIR/$module.routes.js"
    touch "$DIR/$module.controller.js"
    touch "$DIR/$module.service.js"
    touch "$DIR/$module.repository.js"

done

# Additional validation files
touch "$ROOT/src/modules/auth/auth.validation.js"
touch "$ROOT/src/modules/products/products.validation.js"
touch "$ROOT/src/modules/sales/sales.validation.js"

# Create package.json if it doesn't exist
cd "$ROOT"

if [[ ! -f package.json ]]; then
    npm init -y
fi

# Configure ES modules without overwriting package.json
node --input-type=module -e '
import fs from "node:fs";

const path = "package.json";
const pkg = JSON.parse(fs.readFileSync(path, "utf8"));

pkg.type = "module";

fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + "\n");
'

echo ""
echo "Server structure created successfully!"
echo ""
echo "Next steps:"
echo "1. Install backend dependencies."
echo "2. Configure environment variables."
echo "3. Configure PostgreSQL connection."
echo "4. Create database migrations."
echo ""
echo "======================================"
