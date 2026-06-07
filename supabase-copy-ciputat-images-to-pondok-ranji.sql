-- Copy menu image URLs and spicy flags from Ciputat to matching Pondok Ranji menu items.
-- Matching is based on category slug + menu name.
-- image_url only fills Pondok Ranji items that do not have image_url yet.
-- is_spicy always follows the Ciputat value for matching items.

WITH ciputat_menu AS (
  SELECT
    mi.name,
    c.slug AS category_slug,
    mi.image_url,
    mi.is_spicy
  FROM menu_items mi
  JOIN branches b ON b.id = mi.branch_id
  JOIN categories c ON c.id = mi.category_id
  WHERE b.slug = 'ciputat'
),
pondok_ranji_menu AS (
  SELECT
    mi.id,
    mi.name,
    c.slug AS category_slug
  FROM menu_items mi
  JOIN branches b ON b.id = mi.branch_id
  JOIN categories c ON c.id = mi.category_id
  WHERE b.slug = 'pondok-ranji'
)
UPDATE menu_items target
SET
  image_url = CASE
    WHEN (target.image_url IS NULL OR target.image_url = '')
      THEN NULLIF(source.image_url, '')
    ELSE target.image_url
  END,
  is_spicy = source.is_spicy,
  updated_at = now()
FROM pondok_ranji_menu target_match
JOIN ciputat_menu source
  ON source.name = target_match.name
  AND source.category_slug = target_match.category_slug
WHERE target.id = target_match.id;

-- Preview matching Pondok Ranji items after sync.
SELECT
  b.slug AS branch,
  c.name AS category,
  mi.name AS menu_name,
  mi.is_spicy,
  mi.image_url
FROM menu_items mi
JOIN branches b ON b.id = mi.branch_id
JOIN categories c ON c.id = mi.category_id
WHERE b.slug = 'pondok-ranji'
ORDER BY c.sort_order, mi.sort_order, mi.name;
