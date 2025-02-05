COPY unicorns (
    id,
    company,
    valuation,
    date_joined,
    country,
    city,
    industry,
    select_investors
  )
FROM './unicorns.csv'
WITH (
  FORMAT csv,
  HEADER true,
  DELIMITER ',',
  QUOTE '"'
);