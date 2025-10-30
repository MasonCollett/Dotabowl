IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Heroes] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Wins] int NOT NULL,
    [Losses] int NOT NULL,
    [Games] int NOT NULL,
    [AdWins] int NOT NULL,
    [AdLosses] int NOT NULL,
    [AdGames] int NOT NULL,
    [TotalGames] int NOT NULL,
    [WinRate] decimal(5,2) NOT NULL,
    CONSTRAINT [PK_Heroes] PRIMARY KEY ([Id])
);

CREATE TABLE [Matches] (
    [Id] int NOT NULL IDENTITY,
    [Length] nvarchar(max) NOT NULL,
    [Type] nvarchar(max) NOT NULL,
    [Winner] nvarchar(max) NOT NULL,
    [RadiantKills] int NOT NULL,
    [DireKills] int NOT NULL,
    [Date] datetime2 NOT NULL,
    CONSTRAINT [PK_Matches] PRIMARY KEY ([Id])
);

CREATE TABLE [Players] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [SteamName] nvarchar(max) NOT NULL,
    [Wins] int NOT NULL,
    [Losses] int NOT NULL,
    [Games] int NOT NULL,
    [AdWins] int NOT NULL,
    [AdLosses] int NOT NULL,
    [AdGames] int NOT NULL,
    [TotalGames] int NOT NULL,
    [WinRate] decimal(5,2) NOT NULL,
    CONSTRAINT [PK_Players] PRIMARY KEY ([Id])
);

CREATE TABLE [MatchParticipants] (
    [Id] int NOT NULL IDENTITY,
    [MatchId] int NOT NULL,
    [PlayerId] int NOT NULL,
    [Team] nvarchar(max) NOT NULL,
    [IsWinner] bit NOT NULL,
    CONSTRAINT [PK_MatchParticipants] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_MatchParticipants_Matches_MatchId] FOREIGN KEY ([MatchId]) REFERENCES [Matches] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_MatchParticipants_Players_PlayerId] FOREIGN KEY ([PlayerId]) REFERENCES [Players] ([Id]) ON DELETE NO ACTION
);

CREATE INDEX [IX_MatchParticipants_MatchId] ON [MatchParticipants] ([MatchId]);

CREATE INDEX [IX_MatchParticipants_PlayerId] ON [MatchParticipants] ([PlayerId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251014035725_InitialCreate', N'9.0.9');

EXEC sp_rename N'[Players].[Wins]', N'TurboWins', 'COLUMN';

EXEC sp_rename N'[Players].[Losses]', N'TurboLosses', 'COLUMN';

EXEC sp_rename N'[Players].[Games]', N'TurboGames', 'COLUMN';

EXEC sp_rename N'[Players].[AdWins]', N'SingleDraftWins', 'COLUMN';

EXEC sp_rename N'[Players].[AdLosses]', N'SingleDraftLosses', 'COLUMN';

EXEC sp_rename N'[Players].[AdGames]', N'SingleDraftGames', 'COLUMN';

ALTER TABLE [Players] ADD [ADARGames] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [ADARLosses] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [ADARWins] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [AllPickGames] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [AllPickLosses] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [AllPickWins] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [AllRandomGames] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [AllRandomLosses] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [AllRandomWins] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [CaptDraftGames] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [CaptDraftLosses] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [CaptDraftWins] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [RandomDraftGames] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [RandomDraftLosses] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [RandomDraftWins] int NOT NULL DEFAULT 0;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251014210151_Update1', N'9.0.9');

ALTER TABLE [Players] ADD [TotalLosses] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [TotalWins] int NOT NULL DEFAULT 0;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251014210341_Update2', N'9.0.9');

ALTER TABLE [Players] ADD [TotalGameTime] decimal(18,2) NOT NULL DEFAULT 0.0;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251014210507_Update3', N'9.0.9');

DECLARE @var sysname;
SELECT @var = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Players]') AND [c].[name] = N'TotalGameTime');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [Players] DROP CONSTRAINT [' + @var + '];');
ALTER TABLE [Players] ALTER COLUMN [TotalGameTime] decimal(8,2) NOT NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251014210547_Update4', N'9.0.9');

ALTER TABLE [Players] ADD [ProfilePictureUrl] nvarchar(max) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251027230557_playerurl', N'9.0.9');

ALTER TABLE [Players] ADD [ADGames] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [ADLosses] int NOT NULL DEFAULT 0;

ALTER TABLE [Players] ADD [ADWins] int NOT NULL DEFAULT 0;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251029001838_ad', N'9.0.9');

DROP TABLE [Heroes];

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251029235303_cleanup', N'9.0.9');

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'ADARGames', N'ADARLosses', N'ADARWins', N'ADGames', N'ADLosses', N'ADWins', N'AllPickGames', N'AllPickLosses', N'AllPickWins', N'AllRandomGames', N'AllRandomLosses', N'AllRandomWins', N'CaptDraftGames', N'CaptDraftLosses', N'CaptDraftWins', N'Name', N'ProfilePictureUrl', N'RandomDraftGames', N'RandomDraftLosses', N'RandomDraftWins', N'SingleDraftGames', N'SingleDraftLosses', N'SingleDraftWins', N'SteamName', N'TotalGameTime', N'TotalGames', N'TotalLosses', N'TotalWins', N'TurboGames', N'TurboLosses', N'TurboWins', N'WinRate') AND [object_id] = OBJECT_ID(N'[Players]'))
    SET IDENTITY_INSERT [Players] ON;
INSERT INTO [Players] ([Id], [ADARGames], [ADARLosses], [ADARWins], [ADGames], [ADLosses], [ADWins], [AllPickGames], [AllPickLosses], [AllPickWins], [AllRandomGames], [AllRandomLosses], [AllRandomWins], [CaptDraftGames], [CaptDraftLosses], [CaptDraftWins], [Name], [ProfilePictureUrl], [RandomDraftGames], [RandomDraftLosses], [RandomDraftWins], [SingleDraftGames], [SingleDraftLosses], [SingleDraftWins], [SteamName], [TotalGameTime], [TotalGames], [TotalLosses], [TotalWins], [TurboGames], [TurboLosses], [TurboWins], [WinRate])
VALUES (3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Mason', N'assets\images\holla.jpg', 0, 0, 0, 0, 0, 0, N'hollahataballah', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Aaron', N'assets\images\aaron.jpg', 0, 0, 0, 0, 0, 0, N'Grim Strokinoff', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Alex', N'assets\images\alex.jpg', 0, 0, 0, 0, 0, 0, N'TekkPhantom4', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Arthur', N'assets\images\arthur.jpg', 0, 0, 0, 0, 0, 0, N'Eddard Slark', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Beau', N'assets\images\beau.jpg', 0, 0, 0, 0, 0, 0, N'rockthecatbox', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Ben', N'assets\images\ben.jpg', 0, 0, 0, 0, 0, 0, N'David Asselhoff', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Brendan', N'assets\images\brendan.jpg', 0, 0, 0, 0, 0, 0, N'Rage Factory', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Donnie', N'assets\images\donnie.jpg', 0, 0, 0, 0, 0, 0, N'six', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Drew', N'assets\images\drew.jpg', 0, 0, 0, 0, 0, 0, N'Rainmaker', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Greg', N'assets\images\greg.jpg', 0, 0, 0, 0, 0, 0, N'#1BESTDICKSUCKERALIVE', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Jeff', N'assets\images\jeff.jpg', 0, 0, 0, 0, 0, 0, N'Actual Waste of Time', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Lucas', N'assets\images\lucas.jpg', 0, 0, 0, 0, 0, 0, N'Ham_boy', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Max', N'assets\images\max.jpg', 0, 0, 0, 0, 0, 0, N'ampersand.', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Sean', N'assets\images\sean.jpg', 0, 0, 0, 0, 0, 0, N'SlugmanTheBrave', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Skyler', N'assets\images\skyler.jpg', 0, 0, 0, 0, 0, 0, N'Jackal', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Wes', N'assets\images\wes.jpg', 0, 0, 0, 0, 0, 0, N'The Dagon Reborn', 0.0, 0, 0, 0, 0, 0, 0, 0.0),
(19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, N'Vincent', N'assets\images\zoltrix.jpg', 0, 0, 0, 0, 0, 0, N'Zoltrix', 0.0, 0, 0, 0, 0, 0, 0, 0.0);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'ADARGames', N'ADARLosses', N'ADARWins', N'ADGames', N'ADLosses', N'ADWins', N'AllPickGames', N'AllPickLosses', N'AllPickWins', N'AllRandomGames', N'AllRandomLosses', N'AllRandomWins', N'CaptDraftGames', N'CaptDraftLosses', N'CaptDraftWins', N'Name', N'ProfilePictureUrl', N'RandomDraftGames', N'RandomDraftLosses', N'RandomDraftWins', N'SingleDraftGames', N'SingleDraftLosses', N'SingleDraftWins', N'SteamName', N'TotalGameTime', N'TotalGames', N'TotalLosses', N'TotalWins', N'TurboGames', N'TurboLosses', N'TurboWins', N'WinRate') AND [object_id] = OBJECT_ID(N'[Players]'))
    SET IDENTITY_INSERT [Players] OFF;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251030053352_Seed', N'9.0.9');

COMMIT;
GO

