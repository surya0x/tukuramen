-- Move non-signature ramen out of Signature Ramen.
-- Signature Ramen should only contain Red Ramen and Tori Paitan Ramen.

UPDATE menu_items
SET
  category_id = (SELECT id FROM categories WHERE slug = 'variasi-ramen'),
  sort_order = CASE name
    WHEN 'Suppai Ramen' THEN 1
    WHEN 'Sukemen' THEN 2
    WHEN 'Red Yasai Ramen' THEN 3
    ELSE sort_order
  END
WHERE name IN ('Suppai Ramen', 'Sukemen', 'Red Yasai Ramen')
  AND category_id = (SELECT id FROM categories WHERE slug = 'signature-ramen');

UPDATE menu_items
SET sort_order = CASE name
  WHEN 'Chicken Katsu Ramen' THEN 4
  WHEN 'Mazesoba' THEN 5
  WHEN 'Maboh Tofu' THEN 6
  WHEN 'Yakisoba' THEN 7
  WHEN 'Curry Ramen / Rice' THEN 8
  ELSE sort_order
END
WHERE category_id = (SELECT id FROM categories WHERE slug = 'variasi-ramen')
  AND name IN ('Chicken Katsu Ramen', 'Mazesoba', 'Maboh Tofu', 'Yakisoba', 'Curry Ramen / Rice');

SELECT
  b.slug AS branch,
  c.name AS category,
  array_agg(m.name ORDER BY m.sort_order, m.name) AS menu_names
FROM menu_items m
JOIN branches b ON b.id = m.branch_id
JOIN categories c ON c.id = m.category_id
WHERE c.slug IN ('signature-ramen', 'variasi-ramen')
GROUP BY b.slug, c.name
ORDER BY b.slug, c.name;
