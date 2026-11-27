const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    const reset = await request.post('/api/testing/reset')
    expect(reset.status()).toBe(204)

    const user = await request.post('/api/users', {
      data: {
        name: 'Student',
        username: 'student',
        password: 'student123'
      }
    })

    expect(user.status()).toBe(201)

    await page.goto('/')
  })

  // 5.28
  test('login succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'student', 'student123')

    await expect(page.getByText('Student logged in')).toBeVisible()
    await expect(page).toHaveURL('/')
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'student', 'wrongpassword')

    await expect(page.getByText('Wrong username or password'))
      .toBeVisible()

    await expect(page.getByText('Student logged in'))
      .not.toBeVisible()
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'student', 'student123')

      await expect(page.getByText('Student logged in'))
        .toBeVisible()
    })

    test('a blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'Learning React',
        'John Smith',
        'https://example.com/react'
      )

      await expect(page.getByRole('link', {
        name: 'Learning React John Smith'
      })).toBeVisible()

      await expect(page).toHaveURL('/')
    })

    describe('When blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'Learning React',
          'John Smith',
          'https://example.com/react'
        )

        await page.getByRole('link', {
          name: 'Learning React John Smith'
        }).click()
      })

      test('a blog can be liked', async ({ page }) => {
        await expect(page.getByText('likes 0')).toBeVisible()

        await page.getByRole('button', {
          name: 'like',
          exact: true
        }).click()

        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        page.once('dialog', dialog => dialog.accept())

        await page.getByRole('button', {
          name: 'remove'
        }).click()

        await expect(page).toHaveURL('/')

        await expect(page.getByRole('link', {
          name: 'Learning React John Smith'
        })).not.toBeVisible()
      })
    })
  })
})