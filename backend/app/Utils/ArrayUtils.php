<?php

namespace App\Utils;

class ArrayUtils
{
    /**
     * Get the array value by path.
     *
     * @param array        $array
     * @param array|string $path
     *
     * @return mixed
     */
    public static function nestedGet(&$array, $path)
    {
        if (!is_array($path)) {
            $pathTokens = explode('.', $path);
        }
        $node = &$array;
        foreach ($pathTokens as $token) {
            if (array_key_exists($token, $node)) {
                $node = &$node[$token];
            } else {
                return null;
            }
        }

        return $node;
    }

    /**
     * Set the array value by path.
     *
     * @param array        $array
     * @param array|string $path
     * @param mixed        $value
     * @param mixed        $override
     */
    public static function nestedSet(&$array, $path, $value, $override = true)
    {
        if (!is_array($path)) {
            $pathTokens = explode('.', $path);
        }
        $lastToken = $pathTokens[count($pathTokens) - 1];
        unset($pathTokens[count($pathTokens) - 1]);
        $node = &$array;
        foreach ($pathTokens as $token) {
            if (!array_key_exists($token, $node)) {
                $node[$token] = [];
            }
            $node = &$node[$token];
        }
        if (array_key_exists($lastToken, $node) && !$override) {
            return;
        }
        $node[$lastToken] = $value;
    }

    /**
     * Set the array value by path.
     *
     * @param array  $array
     * @param string $key
     *
     * @return array
     */
    public static function keyBy(&$array, $key = 'id')
    {
        $list = [];
        foreach ($array as $item) {
            $list[$item[$key]] = $item;
        }

        return $list;
    }

    /**
     * Flatten a tree and return a flat array.
     * Every element will have a "parent" field with the parent[$parentKey] value.
     *
     * @param $tree
     * @param $subKey
     * @param $parentKey
     * @param $parentVal
     *
     * @return array
     */
    public static function flatten($tree, $subKey, $parentKey = null, $parentVal = null)
    {
        $result = [];
        foreach ($tree as $element) {
            $result = array_merge($result, self::flatten($element[$subKey], $subKey, $parentKey, $element[$parentKey]));
            $element['parent'] = $parentVal;
            unset($element[$subKey]);
            $result[] = $element;
        }

        return $result;
    }

    public static function flatKeys($array, $prefix = '')
    {
        $result = [];
        foreach ($array as $key => $value) {
            $new_key = $prefix . (empty($prefix) ? '' : '.') . $key;
            if (is_array($value)) {
                $result = array_merge($result, static::flatKeys($value, $new_key));
            } else {
                $result[$new_key] = $value;
            }
        }

        return $result;
    }

    public static function unflatKeys($array)
    {
        $result = [];
        foreach ($array as $key => $value) {
            static::nestedSet($result, $key, $value);
        }

        return $result;
    }

    /**
     * Set the array value by path.
     *
     * @param array  $array
     * @param string $key
     *
     * @return array
     */
    public static function stdKeyBy(&$array, $key = 'id')
    {
        $list = [];
        foreach ($array as $item) {
            $list[$item->{$key}] = $item;
        }

        return $list;
    }

    public static function extractKeys($array, $keys)
    {
        return array_intersect_key($array, array_flip($keys));
    }

    /**
     * Merge two associative arrays avoid overwriting with null values.
     *
     * @param array $input
     * @param array $output
     *
     * @return array
     */
    public static function arrayMergeNoNullOverwrite(array $input, array $output = [])
    {
        foreach ($input as $key => $value) {
            if (is_array($value)) {
                $output[$key] = self::arrayMergeNoNullOverwrite($value, $output[$key] ?: []);
            } elseif (!isset($output[$key]) && $value !== null) {
                $output[$key] = $value;
            }
        }

        return $output;
    }

    /**
     * Check if two arrays are equal ingoring order.
     *
     * @param array $a1
     * @param array $a2
     *
     * @return bool
     */
    public static function arrayEqual($a1, $a2)
    {
        return !array_diff($a1, $a2) && !array_diff($a2, $a1);
    }

    /**
     * Search for a value and return the relative key.
     * Works with array with the following structure:
     * [
     *   'idx1' => ['alpha', 'beta'],
     *   'idx2' => ['charlie', 'delta']
     * ];.
     *
     * @param $needle
     * @param array $haystack
     *
     * @return null|int|string
     */
    public static function arraySearchMultidimensional($needle, $haystack)
    {
        return key(array_filter($haystack, function ($val) use ($needle) {
            return in_array($needle, $val);
        }));
    }

    /**
     * Return all the values of a multidimensional array.
     * Works with array with the following structure:
     * [
     *   'idx1' => ['alpha', 'beta'],
     *   'idx2' => ['charlie', 'delta']
     * ];.
     *
     * @param array $array
     *
     * @return mixed
     */
    public static function arrayValuesMultidimensional($array)
    {
        return array_reduce($array, function ($arr, $acc) {
            return array_merge($arr, $acc);
        }, []);
    }
}
