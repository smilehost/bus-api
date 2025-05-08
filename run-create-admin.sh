#!/bin/bash

# แสดงวิธีใช้เมื่อใส่ -h หรือ --help
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
  echo ""
  echo "🛠️  Usage: $0 <comid> <username> <name>"
  echo ""
  echo "Example:"
  echo "  $0 1 admin56 som"
  echo ""
  exit 0
fi

# ตรวจสอบว่าใส่ arguments มาครบหรือไม่
if [ "$#" -lt 3 ]; then
  echo "❌ Error: Missing arguments."
  echo "Run '$0 -h' for help."
  exit 1
fi

# รับ arguments
COMID=$1
USERNAME=$2
NAME=$3

# รันคำสั่ง
npm run cli -- create-admin --comid="$COMID" --username="$USERNAME" --name="$NAME"