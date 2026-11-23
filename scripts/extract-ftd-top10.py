"""Reproduce the October 30 ranking from an SEC pipe file or saved CSV export."""

import argparse
import csv
import hashlib
import json
from decimal import Decimal, InvalidOperation
from pathlib import Path


def extract(source, output):
    rows = []
    source_count = snapshot_count = missing_price_count = 0
    with source.open(encoding="utf-8-sig", newline="") as handle:
        delimiter = "|" if "|" in handle.readline() else ","
        handle.seek(0)
        for item in csv.DictReader(handle, delimiter=delimiter):
            if not item.get("SETTLEMENT DATE"):
                continue
            source_count += 1
            if item["SETTLEMENT DATE"].strip() != "20261030":
                continue
            snapshot_count += 1
            try:
                quantity = int(item["QUANTITY (FAILS)"].strip())
                price = Decimal(item["PRICE"].strip())
                if not price.is_finite() or price <= 0:
                    raise InvalidOperation
            except (ValueError, InvalidOperation):
                missing_price_count += 1
                continue
            cusip = item["CUSIP"].strip()
            rows.append({
                "settlement_date": "2026-10-30",
                "symbol": item["SYMBOL"].strip(),
                "cusip_as_imported": cusip,
                "cusip_status": "length_ok_unvalidated" if len(cusip) == 9 and cusip.isalnum() else "import_corrupted_do_not_use",
                "quantity_fails": quantity,
                "description": item["DESCRIPTION"].strip(),
                "price_usd": str(price),
                "estimated_dollar_value_usd": (quantity * price).quantize(Decimal("0.01")),
            })
    rows.sort(key=lambda item: (-item["estimated_dollar_value_usd"], item["symbol"]))
    if len(rows) < 10:
        raise ValueError("Expected at least ten priced October 30 rows")
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["rank", *rows[0]])
        writer.writeheader()
        for rank, row in enumerate(rows[:10], start=1):
            writer.writerow({"rank": rank, **row})
    return {
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "source_rows": source_count,
        "snapshot_rows": snapshot_count,
        "excluded_unpriced_rows": missing_price_count,
        "top10_symbols": [row["symbol"] for row in rows[:10]],
        "output": str(output),
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--output", type=Path, default=Path("data/ftd-2026-10-30-top10.csv"))
    arguments = parser.parse_args()
    print(json.dumps(extract(arguments.source, arguments.output), indent=2))
