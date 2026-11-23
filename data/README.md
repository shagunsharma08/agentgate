# October 30, 2026 analysis extract

`ftd-2026-10-30-top10.csv` contains the ten largest estimated dollar balances in the October 30 snapshot from Shagun Sharma's saved analysis sheet of SEC Fails-to-Deliver data.

## Reproduction

The saved sheet has 63,159 rows, including 5,531 rows for October 30. Thirty-six rows in that snapshot have no usable price and are excluded from the dollar-value ranking. The remaining rows are sorted by `quantity_fails * price_usd`, descending, with two-decimal arithmetic. The sheet's precomputed rounded display column is not used.

```sh
python scripts/extract-ftd-top10.py path/to/saved-sheet.csv
```

The same script accepts an original SEC pipe-delimited text file. Export used for this extract (SHA-256):

```text
29ac2cd3d927954e4181389f687fb2f00040cfea103cbbe97a4e51f057c648ce
```

## Interpretation

- These are outstanding fail balances across NSCC members, not new failures during the day.
- The SEC price field generally contains the previous day's closing price. Dollar estimates are not realized losses.
- Ranking by value does not establish trading-volume concentration or the cause of any fail.
- `BRKB` is the source-sheet ticker corresponding to Berkshire Hathaway Class B, shown as BRK.B in the narrative.
- `cusip_as_imported` preserves the saved sheet's identifiers. The eight-character BRKB value is explicitly flagged as import-corrupted. No missing digits have been silently reconstructed. Import this column as text; even a nine-character value is not a completed CUSIP validation.

[SEC source page and dataset definitions](https://www.sec.gov/data-research/sec-markets-data/fails-deliver-data)

[Original second-half October 2026 ZIP](https://www.sec.gov/files/data/fails-deliver-data/cnsfails202610b.zip)
